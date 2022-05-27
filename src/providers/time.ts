import { subDays } from 'date-fns';
import { ITimeProvider } from '@/types/providers/time';

function TimeProvider(): ITimeProvider {
  function subtractDays(days: number) {
    return subDays(new Date(), days);
  }

  return {
    subtractDays,
  };
}

export default TimeProvider;
