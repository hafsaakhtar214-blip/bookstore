import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './Components/Navbar.js';
import Picture from './Components/Picture';
import TopSeller from './Components/TopSeller.js';
import Collection from './Components/Collection.js';
import Footer from './Components/Footer.js';
import Recently from './Components/Recently.js';
import Product from './Components/Product.js';
import About from './Components/About.js';
import Design from './Components/Design.js';
import Search from './Components/Search.js';
import Details from './Components/Details.js';
import Login from './Components/Login.js';
import Sign from './Components/Sign.js';
import Cart from './Components/Cart.js';
import CheckoutForm from './Components/CheckoutForm.js';
import Admin from './Components/Admin.js';
import AdminMain from './Components/AdminMain.js';
import Admindelete from './Components/Admindelete.js';


function Layout() {
  const location = useLocation();
  const adminPaths = ["/adminmainpanel", "/addproduct", "/deleteproduct"];
  const isAdminPage = adminPaths.includes(location.pathname);

  return (
    <div className="App app-container">
      {!isAdminPage && <Navbar title="BOOK HIVE" />}

      <div className="content">
        <Routes>
          <Route path="/" element={
            <>
              <Picture />
              <h1 className='main' style={{ textAlign: 'center', marginTop: '100px' }}>Our Top Sellers</h1>
              <TopSeller
                image="https://picsum.photos/400/200"
                productName="The Great Gatsby"
                description="A classic novel by F. Scott Fitzgerald."
              />
              <Collection />
              <h1 style={{ fontSize: "33px", fontWeight: "bold", textAlign: "center", marginTop: '54px' }}>
                Recently Added
              </h1>
              <Recently />
              <Design />
            </>
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/books/:id" element={<Details />} />
          <Route path="/products" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Sign />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/adminmainpanel" element={<AdminMain />} />
          <Route path="/addproduct" element={<Admin />} />
          <Route path="/deleteproduct" element={<Admindelete />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
