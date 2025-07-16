export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import MovieSchedule from '@/components/MovieSchedule';

interface Theater {
  id: number;
  name: string;
  address: string;
  city: string;
}

async function getTheaterDetails(id: string): Promise<Theater | null> {
  try {
    const res = await fetch(`http://backend_service:8080/theaters/${id}`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching theater details:`, error);
    return null;
  }
}

export default async function TheaterDetailPage({ params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id); 

  const theaterDetails = await getTheaterDetails(id);

  if (!theaterDetails) {
    return <div className="text-white text-center pt-20">Không tìm thấy thông tin rạp.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-sky-400">{theaterDetails.name}</h1>
        <p className="text-lg text-gray-400 mt-2">{theaterDetails.address}</p>
      </div>

      <MovieSchedule theaterId={theaterDetails.id} />
    </div>
  );
}
