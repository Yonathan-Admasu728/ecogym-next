import { Program } from '../types';

type ProgramCategory = (typeof PROGRAM_CATEGORIES)[keyof typeof PROGRAM_CATEGORIES];
type ValidCategory = ProgramCategory | 'Loading...';

export const PROGRAM_CATEGORIES = {
  MEDITATION: 'meditation',
  WORKOUT: 'workout',
} as const;

const categoryImageMap = {
  'meditation': '/images/med1.png',
  'workout': '/images/strength.png',
} as const;

export function isProgramCategory(category: string): boolean {
  const normalizedCategory = category?.toLowerCase();
  return Object.values(PROGRAM_CATEGORIES).includes(normalizedCategory as ProgramCategory);
}

export function transformProgramsResponse(programs: Program[]): { results: Program[] } {
  const transformedPrograms = programs.map(program => {
    const normalizedCategory = program.category?.toLowerCase();
    const validCategory: ValidCategory = Object.values(PROGRAM_CATEGORIES).includes(normalizedCategory as ProgramCategory)
      ? normalizedCategory as ProgramCategory
      : 'Loading...';

    return {
      ...program,
      // If S3 image fails, use local fallback based on category
      thumbnail: program.thumbnail || categoryImageMap[validCategory as keyof typeof categoryImageMap] || '/images/fallback.png',
      // Ensure level is one of the valid values
      level: program.level || 'All Levels',
      // Ensure category is valid
      category: validCategory,
    } as Program;
  });

  return { results: transformedPrograms };
}

export function transformProgramResponse(program: Program): Program {
  const normalizedCategory = program.category?.toLowerCase();
  const validCategory: ValidCategory = Object.values(PROGRAM_CATEGORIES).includes(normalizedCategory as ProgramCategory)
    ? normalizedCategory as ProgramCategory
    : 'Loading...';

  return {
    ...program,
    // If S3 image fails, use local fallback based on category
    thumbnail: program.thumbnail || categoryImageMap[validCategory as keyof typeof categoryImageMap] || '/images/fallback.png',
    // Ensure level is one of the valid values
    level: program.level || 'All Levels',
    // Ensure category is valid
    category: validCategory,
  } as Program;
}
