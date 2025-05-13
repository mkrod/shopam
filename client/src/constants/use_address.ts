import { useState, useEffect } from "react";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
}

export function useCurrentAddress() {
  const [current_address, setCurrentAddress] = useState<Address | null>(null);
  const [address_loading, setAddressLoading] = useState(true);
  const [address_error, setAddressError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddressError(true);
      setAddressLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address: Address = {
            street: data.address.road || "",
            city: data.address.city || data.address.town || data.address.village || "",
            state: data.address.state || "",
            country: data.address.country || "",
            fullAddress: [
              data.address.house_number || "",
              data.address.road || "",
              data.address.city || data.address.town || data.address.village || "",
              data.address.state || "",
              data.address.country || ""
            ]
              .filter(Boolean)  // Remove empty strings
              .join(", "),      // Join with comma and space
          };
          setCurrentAddress(address);
        } catch {
          setAddressError(true);
        } finally {
          setAddressLoading(false);
        }
      },
      () => {
        setAddressError(true);
        setAddressLoading(false);
      }
    );
  }, []);

  return { current_address, address_loading, address_error };
}
