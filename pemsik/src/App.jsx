import { useEffect, useState } from "react";
import { supabase } from "@/src/supabaseClient";

const App = () => {
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchDosen() {
      const { data, error } = await supabase.from("mahasiswa").select("*");

      if (error) {
        console.error("Error:", error);
        setErrorMsg(error.message);
      } else {
        setDosen(data);
      }
      setLoading(false);
    }

    fetchDosen();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (errorMsg) return <p>Error: {errorMsg}</p>;

  return (
    <div>
      <h1>Test Koneksi Supabase</h1>
      <ul>
        {dosen.map((d) => (
          <li key={d.id}>
            {d.nama} - {d.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
