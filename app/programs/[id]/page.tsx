// app/programs/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProgramPurchase from '../../components/ProgramPurchase';
import PurchaseStatus from '../../components/PurchaseStatus';
import { Program } from '../../types';
import { PaymentService } from '../../services/PaymentService';
import { useAuth } from '../../context/AuthContext';

const ProgramDetail = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [program, setProgram] = useState<Program | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id && user) {
      // Fetch program details
      fetch(`/api/programs/${id}`)
        .then(res => res.json())
        .then(data => {
          setProgram(data as Program);
          console.log('Fetched program:', data); // Log fetched data
        })
        .catch(error => console.error('Error fetching program:', error));
    }
  }, [id, user]);

  if (!program) return <div>Loading...</div>;

  return (
    <div>
      <h1>{program.title}</h1>
      <PurchaseStatus programId={program.id} />
      <ProgramPurchase
        programId={program.id}
        price={program.price}
        title={program.title}
        stripePriceId={program.stripe_price_id}
      />
    </div>
  );
};

export default ProgramDetail;