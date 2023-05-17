import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Edit, Load, Main } from './views'
import { Nav } from './components/Nav/Nav'
import { RecoilRoot } from 'recoil'

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/edit' element={<Edit />} />
          <Route path='/load' element={<Load />} />
          <Route path='/' element={<Main />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
