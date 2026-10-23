import { LandingView } from 'src/sections/landing';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Тора Вару — бизнес процесс, систем нэвтрүүлэлт',
  description:
    'Бизнес процессын зураглал, программын шаардлага, ERP болон финтек систем нэвтрүүлэлт. ' +
    'Хурган зээл, сагсан бөмбөгийн багийн удирдлагын систем, task management систем.',
};

export default function HomePage() {
  return <LandingView />;
}
