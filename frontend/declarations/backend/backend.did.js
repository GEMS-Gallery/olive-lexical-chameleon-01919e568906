export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getBitcoinPrice' : IDL.Func([], [IDL.Opt(IDL.Float64)], []),
    'getLastUpdateTime' : IDL.Func([], [IDL.Int], ['query']),
    'updatePrice' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
