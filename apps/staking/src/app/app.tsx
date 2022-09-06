import styled from '@emotion/styled';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome staking app 👋
            </h1>
          </div>
        </div>
      </div>
    </StyledApp>
  );
}

export default App;
