// components/AlbumCard.jsx

import Link from "next/link"

export default function AlbumCard({ album }) {
    return (
        <Link href={`/gallery/albums/${album.id}`} className="block group">
            <div className="relative overflow-hidden rounded-lg shadow-md">
                {album.cover_image ? (
                    <img 
                        src={album.cover_image} 
                        alt={album.title}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <img 
                        src="assets/images/placeholder.png" 
                        alt={album.title}
                        className="w-full h-48 object-cover"
                    />
                )}
                
                <div className="p-4 bg-white">
                    <h3 className="font-bold">{album.title}</h3>
                    <p className="text-sm text-gray-600">
                        {album.galleries_count || 0} foto
                    </p>
                    {album.gdrive_folder_url && (
                        <a 
                            href={album.gdrive_folder_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 text-sm mt-2 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Buka Folder Drive
                        </a>
                    )}
                </div>
            </div>
        </Link>
    );
}