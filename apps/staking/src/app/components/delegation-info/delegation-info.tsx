import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface DelegationInfoProps {}

const StyledDelegationInfo = styled.div`
  color: pink;
`;

export function DelegationInfo(props: DelegationInfoProps) {
  return (
    <StyledDelegationInfo>
      <h1>Welcome to DelegationInfo!</h1>
    </StyledDelegationInfo>
  );
}

export default DelegationInfo;
