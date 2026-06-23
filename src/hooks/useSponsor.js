// hooks/useSponsor.js
import { useState, useEffect } from "react";
import { sponsorService } from "../services/sponsorService";

export function useSponsor() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    sponsorService.getAll()
      .then(res => {
        const data = res.data.data;
        const allSponsors = Object.values(data).flat();
        setSponsors(allSponsors);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { sponsors, loading, error };
}