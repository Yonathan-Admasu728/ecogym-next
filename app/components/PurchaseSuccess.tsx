// // app/components/PurchaseSuccess.tsx

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { PaymentService, handleApiError } from '../services/PaymentService';
// import { useAuth } from '../context/AuthContext';

// const PurchaseSuccess: React.FC = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { program } = router.query;
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const confirmPurchase = async () => {
//       if (!user) {
//         console.log('Waiting for user authentication...');
//         return;
//       }

//       if (program && typeof program === 'string') {
//         try {
//           console.log('Confirming purchase for program:', program);
//           const result = await PaymentService.checkPurchaseStatus(Number(program));
//           console.log('Purchase status result:', result);
//           setIsLoading(false);
//         } catch (error) {
//           console.error('Error confirming purchase:', error);
//           setError('Failed to confirm purchase. Please contact support.');
//           handleApiError(error);
//           setIsLoading(false);
//         }
//       } else {
//         console.log('No program ID provided');
//         setError('No program ID provided');
//         setIsLoading(false);
//       }
//     };

//     if (user) {
//       confirmPurchase();
//     }
//   }, [program, user]);

//   if (isLoading) {
//     return <div>Confirming your purchase...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>Purchase Successful!</h1>
//       <p>Thank you for your purchase. You now have access to the program.</p>
//       <button onClick={() => router.push(`/program/${program}`)}>
//         Go to Program
//       </button>
//     </div>
//   );
// };

// export default PurchaseSuccess;