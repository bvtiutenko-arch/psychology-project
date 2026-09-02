import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/core/Dashboard';
import Spinner from './components/ui/Spinner';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import CausalMatrixForm from './components/causal/CausalMatrixForm';
import NightMode from './components/core/NightMode';
import TomorrowBox from './components/core/TomorrowBox';
import Analytics from './components/core/Analytics';
import Settings from './components/core/Settings';
import ConnectionMap from './components/core/ConnectionMap';
import History from './components/core/History';
import Landing from './components/public/Landing';
import { Privacy, Terms, Contact, FAQ, CookiePolicy, LegalNotice } from './components/public/LegalPages';
// ...
