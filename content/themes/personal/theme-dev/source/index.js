import './style/style.scss';

import serviceManager from './services/serviceManager';
import resizeService from './services/resizeService';

import home from './pages/home';

serviceManager.init(resizeService); 


