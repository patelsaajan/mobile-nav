import MobileNav from './MobileNav';

export function App() {
  return (
    <div style={{
      background: 'black',
      height: 'calc(100vh - 100px)',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      padding: '40px',
    }}>
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '50%',
      }}
    >
      <MobileNav />

    </div>
      

    </div>
  );
}

export default App;
