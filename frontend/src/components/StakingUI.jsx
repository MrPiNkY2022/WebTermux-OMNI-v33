import { useAccount, useContractWrite } from 'wagmi';
import { stakingABI } from '../abis';

export function StakingUI({ stakingAddress }) {
  const { address } = useAccount();
  const { write: stake } = useContractWrite({
    address: stakingAddress,
    abi: stakingABI,
    functionName: 'stake',
  });

  return (
    <div className="omni-card">
      <h2>Stake OMNI</h2>
      <button onClick={() => stake({ args: [ethers.parseEther('100')] })}>
        Stake 100 OMNI
      </button>
    </div>
  );
}
