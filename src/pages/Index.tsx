import { assetPath } from '@/lib/asset-path';

const PlaceholderIndex = () => {
  const placeholderImage = assetPath('placeholder.svg');

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#fcfbf8' }}>
      <img src={placeholderImage} alt="Application placeholder" />
    </div>
  );
};

const Index = PlaceholderIndex;

export default Index;
