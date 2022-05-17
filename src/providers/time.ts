import { subDays } from 'date-fns';
import { TimeProvider } from '@/types/providers/time';

function TimeProvider(): TimeProvider {
  function subtractDays(days: number) {
    return subDays(new Date(), days);
  }

  return {
    subtractDays,
  };
}

export default TimeProvider;
