const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const response = await api.get("/api/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  fetchUserData();
}, []);
