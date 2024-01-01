import { useState } from 'react';

interface PaymentStatus {
  status: 'success' | 'failure' | null;
  amount: string | number | null;
}

function PaymentComponent(){ 
  const [amount, setAmount] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: null,
    amount: null,
  });

  const handlePayment = async (): Promise<void> => {
    if (+amount <= 0) {
      announceInvalidAmount();
      return;
    }

    // Call payment gateway API to initiate payment
    try {
      // Replace this with actual payment gateway integration
      await simulatePayment();

      setPaymentStatus({ status: 'success', amount });
      announceTransactionAmount(amount);
    } catch (error) {
      setPaymentStatus({ status: 'failure', amount: null });
    }
  };

  const announceInvalidAmount = (): void => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis; // convert text to speech via speaker
      const invalidAmount = new SpeechSynthesisUtterance('Please enter a valid amount and try again!');
      synth.speak(invalidAmount);
    }
  };

  const announceTransactionAmount = (transactionAmount: string): void => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;

      const rupeesVoice = new SpeechSynthesisUtterance('Payment Successful. Rupees ');
      const amountVoice = new SpeechSynthesisUtterance(transactionAmount);

      const voices = synth.getVoices();
      const englishIndiaVoice = voices.find(voice => voice.name.includes('English India'));
      const amountVoicePreference = voices.find(voice => voice.name.includes('your-preferred-amount-voice'));
rupeesVoice.voice = englishIndiaVoice || voices[0]; // Fallback to the first voice if not found
amountVoice.voice = amountVoicePreference || voices[1]; // Fallback to the second voice if not found

      rupeesVoice.onend = () => {
        synth.speak(amountVoice);
      };

      synth.speak(rupeesVoice);
    }
  };

  return (
    <div className='flex items-center justify-center bg-[#222] font-bold w-full h-screen'>
      <div className='w-[500px] h-[346px] bg-white rounded-lg p-4'>
        <div className='flex flex-col justify-center items-center gap-y-8'>
          <h2 className='text-[48px]'>Make a Payment</h2>
          <input
            type='number'
            placeholder='Enter amount'
            value={amount}
            className='px-4 py-3 rounded-sm bg-sky-100'
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className='text-white font-bold bg-sky-400 hover:bg-sky-500 py-3 px-10 rounded-md shadow-lg'
            onClick={handlePayment}>
              Pay
          </button>
          {paymentStatus.status === 'success' && (
  <p>
    Payment successful! Rupees ${paymentStatus.amount?.toString()}
  </p>
)}

        </div>
      </div>
    </div>
  );
}

async function simulatePayment(): Promise<void> {
  // process a delay to process actual API call
  await new Promise<void>(interval => setTimeout(interval, 2000));
  // process successful payment
}

export default PaymentComponent;
