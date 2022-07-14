type Failure<E> = {
  readonly _tag: 'Failure';
  readonly failure: E;
};

type Success<A> = {
  readonly _tag: 'Success';
  readonly success: A;
};

export type Either<E, A> = Failure<E> | Success<A>;

export const isFailure = <E, A>(ma: Either<E, A>): ma is Failure<E> => ma?._tag === 'Failure';

export const isSuccess = <E, A>(ma: Either<E, A>): ma is Success<A> => ma?._tag === 'Success';

export const failure = <E = never, A = never>(e: E): Either<E, A> => ({
  _tag: 'Failure',
  failure: e,
});

export const success = <E = never, A = never>(a: A): Either<E, A> => ({
  _tag: 'Success',
  success: a,
});
