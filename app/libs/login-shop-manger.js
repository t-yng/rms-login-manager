export default class LoginShopManager {
    static async getLoginShops() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([this._LOGIN_SHOPS_STORAGE_KEY()], (result) => {
                const loginShops = (result.loginShops !== undefined) ? result.loginShops : [];
                resolve(loginShops);
            });
        })
    }

    static async getLoginShop(loginShopId) {
        const loginShops = await this.getLoginShops();
        let loginShop = loginShops.find((shop) => shop.id === loginShopId);
        loginShop = (loginShop !== undefined) ? loginShop : this._createNewLoginShop();
        return loginShop;
    }

    static async insertLoginsShop(loginShop) {
        let loginShops = await this.getLoginShops();
        loginShops.push(loginShop);
        chrome.storage.sync.set({loginShops}, () => {
            return true;
        });
    }

    static async updateLoginShop(beforeLoginShopId, loginShop) {
        let loginShops = await this.getLoginShops();
        const index = loginShops.findIndex((shop) => shop.id === beforeLoginShopId);
        loginShops[index] = loginShop;
        chrome.storage.sync.set({loginShops}, () => {
            return true;
        });
    }

    static async deleteLoginShop(loginShopId) {
        const loginShops = await this.getLoginShops();
        const deletedLoginShops = loginShops.filter((shop) => shop.id !== loginShopId);
        chrome.storage.sync.set({loginShops: deletedLoginShops}, () => {
            return true;
        })
    }

    static _createNewLoginShop() {
        return {
            name: '',
            rLogin: {
                id: '',
                password: ''
            },
            rakutenMember: {
                id: '',
                password: ''
            }
        }
    }

    static _LOGIN_SHOPS_STORAGE_KEY() {
        return 'loginShops';
    }

}