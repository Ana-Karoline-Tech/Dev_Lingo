import type { Lesson, Unit } from '../types';

let unitsCache: Unit[] = [];

export function setUnitsCache(units: Unit[]): void {
  unitsCache = units;
}

export function getUnitsCache(): Unit[] {
  return unitsCache;
}

export function findLessonInCache(lessonId: string): Lesson | null {
  for (const unit of unitsCache) {
    const lesson = unit.lessons?.find((item) => item.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }

  return null;
}
