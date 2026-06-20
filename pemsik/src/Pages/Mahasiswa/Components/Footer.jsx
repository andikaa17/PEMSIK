const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-6">
      <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sistem Akademik Mahasiswa. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
