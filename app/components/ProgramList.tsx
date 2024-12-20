import { Program } from '../types';
import ProgramListClient from './ProgramListClient';

interface ProgramListProps {
  title: string;
  programs: Program[];
}

export default function ProgramList({ 
  title, 
  programs 
}: ProgramListProps): JSX.Element {
  return <ProgramListClient programs={programs} title={title} />;
}
