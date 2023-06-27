import { Route, Routes } from 'react-router-dom';
import SignIn from './Sign-In';
import Stream from './Stream';
import Item from './Item';


function App() {
  const feedUrl = 'https://nintil.com/rss.xml';
  return (
    <>
      <div className="flex justify-center items-center min-w-full min-h-screen theme-dark-night bg-secondary overflow-hidden">
        <div className='w-full max-w-6xl mx-auto text-primary'>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="stream" element={<Stream feedUrl={feedUrl} />} />
            <Route path="/item/:id" element={<Item />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
