// 'use client';

// import React from 'react';
// import { Program } from '../types';
// import ProgramCard from './ProgramCard';

// interface DashboardFeaturedProgramsProps {
//   programs: Program[];
// }

// const DashboardFeaturedPrograms: React.FC<DashboardFeaturedProgramsProps> = ({ programs }) => {
//   return (
//     <div className="p-4">
//       <h2 className="text-3xl font-bold mb-6">Featured Programs</h2>
//       {programs.length > 0 ? (
//         <div className="grid grid-cols-1 gap-4">
//           {programs.map((program) => (
//             <ProgramCard
//               key={program.id}
//               program={program}
//               isFeatured={false}
//               onExplore={() => {/* Handle explore */}}
//             />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No featured programs available at the moment.</p>
//       )}
//     </div>
//   );
// };

// export default DashboardFeaturedPrograms;