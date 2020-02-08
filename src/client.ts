import { Credentials } from "./credentials";
import { request } from "./request";

interface Bookmark {
  comment: string;
  comment_raw: string;
  created_datetime: string;
  created_epoch: number;
  eid: string;
  permalink: string;
  private: boolean;
  tags: string[];
  user: string;
}

interface BookmarkWithFavorites extends Bookmark {
  favorites: Bookmark[];
}

class Client {
  private credentials: Credentials;

  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  public getBookmark({ url }: { url: string }): Promise<BookmarkWithFavorites> {
    return request("getBookmark", this.oauth(), { url });
  }

  public postBookmark(params: {
    comment?: string;
    post_evernote?: boolean;
    post_facebook?: boolean;
    post_mixi?: boolean;
    post_twitter?: boolean;
    private?: boolean;
    send_mail?: boolean;
    tags?: string[];
    url: string;
  }): Promise<Bookmark> {
    return request("postBookmark", this.oauth(), params);
  }

  public deleteBookmark({ url }: { url: string }): Promise<void> {
    return request("deleteBookmark", this.oauth(), { url });
  }

  public getEntry({ url }: { url: string }): Promise<Entry> {
    return request("getEntry", this.oauth(), { url });
  }

  public getTags(_params: {}): Promise<Tag[]> {
    return request<{}, { tags: Tag[] }>("getTags", this.oauth(), {}).then(
      ({ tags }) => tags
    );
  }

  public getUser(_params: {}): Promise<User> {
    return request("getUser", this.oauth(), {});
  }

  private oauth(): Credentials {
    return this.credentials;
  }
}

interface Entry {
  count: number;
  eid: string;
  entry_url: string;
  favicon_url: string;
  has_asin: boolean;
  is_invalid_url: boolean;
  root_url: string;
  smartphone_app_entry_url: string;
  title: string;
  title_last_editor: string;
  url: string;
}

interface Tag {
  count: number;
  tag: string;
}

interface User {
  is_oauth_evernote: boolean;
  is_oauth_facebook: boolean;
  is_oauth_mixi_check: boolean;
  is_oauth_twitter: boolean;
  name: string;
  plususer: boolean;
  private: boolean;
}

export { Bookmark, BookmarkWithFavorites, Client, Entry, Tag, User };
