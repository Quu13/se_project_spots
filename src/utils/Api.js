class Api {
    constructor({baseUrl, headers}) {
      this._baseUrl = baseUrl;
      this._headers = headers;
    }

    _checkResponse(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }

    _request(endpoint, options = {}) {
      const finalOptions = {
        headers: this._headers,
        ...options,
      };
      const url = `${this._baseUrl}${endpoint}`;
      return fetch(url, finalOptions).then(this._checkResponse);
    }

    // API mehtods

    getAppInfo() {
      return Promise.all([this.getInitialCards(), this.getUserInfo()]);
    }
  
    getInitialCards() {
      return this._request("/cards");
    }

    getUserInfo() {
      return this._request("/users/me");
    }

  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }
}
  
    
  
  export default Api;