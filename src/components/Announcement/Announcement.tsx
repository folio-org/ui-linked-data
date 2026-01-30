import React, { useEffect, useState } from 'react';

type AnnouncementProps = {
  message: string;
  onClear?: VoidFunction;
  clearAfter?: number;
};

export const Announcement: React.FC<AnnouncementProps> = ({ message, onClear, clearAfter = 1000 }) => {
  const [announcement, setAnnouncement] = useState(message);

  useEffect(() => {
    setAnnouncement(message);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (clearAfter > 0) {
      timer = setTimeout(() => {
        setAnnouncement('');
        onClear?.();
      }, clearAfter);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, clearAfter]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px' }}>
      {announcement}
    </div>
  );
};
