import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faBuilding, faIndustry, faTrophy, faShield, faGear,
  faChartLine, faUsers, faHandshake, faAward, faRocket, faGlobe,
  faCheckCircle, faHeart, faBolt, faClock, faMap, faTools,
  faLightbulb, faMedal, faThumbsUp, faFlag, faCrown, faFire,
  faDiamond, faCircleCheck, faInfinity, faMicrochip, faServer,
  faDatabase, faCode, faCog, faWrench, faHammer,
  faScrewdriverWrench, faBuildingColumns, faBuildingUser,
  faMoneyBillWave, faCoins, faPercent, faChartBar, faArrowTrendUp,
  // Íconos para productos
  faDesktop, faTv, faPrint, faHandPointer, faLayerGroup,
  faPlug, faWifi, faHeadset, faCube, faRulerVertical,
  faNetworkWired, faLaptopCode, faShoppingCart, faDice,
  faPuzzlePiece, faEye, faWind, faTicket, faHospital,
  faBox, faCertificate, faExpand, faSliders, faTableCells
} from '@fortawesome/free-solid-svg-icons';
import './IconSelector.css';

const ICONOS_DISPONIBLES = [
  { nombre: 'faStar',              icono: faStar },
  { nombre: 'faTrophy',            icono: faTrophy },
  { nombre: 'faMedal',             icono: faMedal },
  { nombre: 'faAward',             icono: faAward },
  { nombre: 'faCrown',             icono: faCrown },
  { nombre: 'faFire',              icono: faFire },
  { nombre: 'faBolt',              icono: faBolt },
  { nombre: 'faRocket',            icono: faRocket },
  { nombre: 'faChartLine',         icono: faChartLine },
  { nombre: 'faChartBar',          icono: faChartBar },
  { nombre: 'faArrowTrendUp',      icono: faArrowTrendUp },
  { nombre: 'faBuilding',          icono: faBuilding },
  { nombre: 'faBuildingColumns',   icono: faBuildingColumns },
  { nombre: 'faBuildingUser',      icono: faBuildingUser },
  { nombre: 'faIndustry',          icono: faIndustry },
  { nombre: 'faShield',            icono: faShield },
  { nombre: 'faHandshake',         icono: faHandshake },
  { nombre: 'faUsers',             icono: faUsers },
  { nombre: 'faGlobe',             icono: faGlobe },
  { nombre: 'faMap',               icono: faMap },
  { nombre: 'faClock',             icono: faClock },
  { nombre: 'faCheckCircle',       icono: faCheckCircle },
  { nombre: 'faCircleCheck',       icono: faCircleCheck },
  { nombre: 'faThumbsUp',          icono: faThumbsUp },
  { nombre: 'faHeart',             icono: faHeart },
  { nombre: 'faFlag',              icono: faFlag },
  { nombre: 'faDiamond',           icono: faDiamond },
  { nombre: 'faInfinity',          icono: faInfinity },
  { nombre: 'faLightbulb',         icono: faLightbulb },
  { nombre: 'faMicrochip',         icono: faMicrochip },
  { nombre: 'faServer',            icono: faServer },
  { nombre: 'faDatabase',          icono: faDatabase },
  { nombre: 'faCode',              icono: faCode },
  { nombre: 'faCog',               icono: faCog },
  { nombre: 'faGear',              icono: faGear },
  { nombre: 'faTools',             icono: faTools },
  { nombre: 'faWrench',            icono: faWrench },
  { nombre: 'faHammer',            icono: faHammer },
  { nombre: 'faScrewdriverWrench', icono: faScrewdriverWrench },
  { nombre: 'faMoneyBillWave',     icono: faMoneyBillWave },
  { nombre: 'faCoins',             icono: faCoins },
  { nombre: 'faPercent',           icono: faPercent },
  // Íconos de productos
  { nombre: 'faDesktop',           icono: faDesktop },
  { nombre: 'faTv',                icono: faTv },
  { nombre: 'faPrint',             icono: faPrint },
  { nombre: 'faHandPointer',       icono: faHandPointer },
  { nombre: 'faLayerGroup',        icono: faLayerGroup },
  { nombre: 'faPlug',              icono: faPlug },
  { nombre: 'faWifi',              icono: faWifi },
  { nombre: 'faHeadset',           icono: faHeadset },
  { nombre: 'faCube',              icono: faCube },
  { nombre: 'faRulerVertical',     icono: faRulerVertical },
  { nombre: 'faNetworkWired',      icono: faNetworkWired },
  { nombre: 'faLaptopCode',        icono: faLaptopCode },
  { nombre: 'faShoppingCart',      icono: faShoppingCart },
  { nombre: 'faDice',              icono: faDice },
  { nombre: 'faPuzzlePiece',       icono: faPuzzlePiece },
  { nombre: 'faEye',               icono: faEye },
  { nombre: 'faWind',              icono: faWind },
  { nombre: 'faTicket',            icono: faTicket },
  { nombre: 'faHospital',          icono: faHospital },
  { nombre: 'faBox',               icono: faBox },
  { nombre: 'faCertificate',       icono: faCertificate },
  { nombre: 'faExpand',            icono: faExpand },
  { nombre: 'faSliders',           icono: faSliders },
  { nombre: 'faTableCells',        icono: faTableCells },
];

function IconSelector({ value, onChange }) {
  const [busqueda, setBusqueda] = useState('');
  const [abierto, setAbierto] = useState(false);

  const iconoActual = ICONOS_DISPONIBLES.find(i => i.nombre === value);

  const filtrados = busqueda.trim()
    ? ICONOS_DISPONIBLES.filter(i =>
        i.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    : ICONOS_DISPONIBLES;

  const seleccionar = (nombre) => {
    onChange(nombre);
    setAbierto(false);
    setBusqueda('');
  };

  return (
    <div className="isel">
      <button
        type="button"
        className="isel__trigger"
        onClick={() => setAbierto(!abierto)}
      >
        {iconoActual
          ? <><FontAwesomeIcon icon={iconoActual.icono} className="isel__trigger-icon" /> {value}</>
          : <span className="isel__placeholder">Elegir ícono...</span>
        }
        <span className="isel__arrow">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className="isel__panel">
          <div className="isel__search-wrap">
            <input
              type="text"
              placeholder="Buscar ícono (ej: star, trophy...)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              autoFocus
            />
          </div>
          <div className="isel__grid">
            {filtrados.length === 0 && (
              <p className="isel__empty">Sin resultados</p>
            )}
            {filtrados.map(({ nombre, icono }) => (
              <button
                key={nombre}
                type="button"
                className={`isel__item ${value === nombre ? 'isel__item--active' : ''}`}
                onClick={() => seleccionar(nombre)}
                title={nombre}
              >
                <FontAwesomeIcon icon={icono} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { ICONOS_DISPONIBLES };
export default IconSelector;
