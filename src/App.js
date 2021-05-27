import './App.css';
import OrderBook from './components/OrderBook/OrderBook';
import styled from 'styled-components'

function App() {
  return (
    <Container>
      <OrderBook/>
    </Container>
  );
}

export const Container = styled.div`
display: flex;
flex-flow: row;
justify-content: center;
align-items: center;

`;

export default App;
