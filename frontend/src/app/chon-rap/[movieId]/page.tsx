import TheaterAndShowtimePicker from '@/components/TheaterAndShowtimePicker';

export default async function SelectTheaterPage({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = params;

  const theaters = await getTheaters();

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Chọn Rạp & Suất Chiếu</h1>
      <TheaterAndShowtimePicker initialTheaters={theaters} movieId={movieId} />
    </div>
  );
}

async function getTheaters() {
  try {
    const res = await fetch('http://backend_service:8080/theaters', { cache: 'no-cache' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch theaters", error);
    return [];
  }
}
