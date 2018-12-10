
export function registerAnnouncementFactory(Announcement, factory) {

  const defaultAnnouncement = {
    title: factory.chance('word'),
    body: factory.chance('paragraph'),
  };

  factory.define('Announcement', Announcement, defaultAnnouncement);

}
