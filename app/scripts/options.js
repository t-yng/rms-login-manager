import md5 from 'blueimp-md5';
import LoginShopManager from '../libs/login-shop-manger';

const setLoginShopForm = (loginShop) => {
    document.getElementById('shop-name').value = loginShop.name;
    document.getElementById('r-login-id').value = loginShop.rLogin.id;
    document.getElementById('r-login-password').value = loginShop.rLogin.password;
    document.getElementById('rakuten-login-id').value = loginShop.rakutenMember.id;
    document.getElementById('rakuten-login-password').value = loginShop.rakutenMember.password;
}

const clearLoginShopForm = () => {
    document.getElementById('shop-name').value = '';
    document.getElementById('r-login-id').value = '';
    document.getElementById('r-login-password').value = '';
    document.getElementById('rakuten-login-id').value = '';
    document.getElementById('rakuten-login-password').value = '';
}

const getLoginShopsSelect = () => {
    return document.querySelector('select[name="login-shop-list"]');
}

const onSelectLoginShop = async (loginShopId) => {
    const loginShop = await LoginShopManager.getLoginShop(loginShopId);
    setLoginShopForm(loginShop);
}

const updateLoginShopsSelect = (loginShops) => {
    const select = getLoginShopsSelect();
    const beforeSelectedIndex = select.selectedIndex;
    select.innerHTML = '';

    let option = document.createElement('option');
    option.setAttribute('value', '');
    option.textContent = '-- 店舗を追加 --';
    select.appendChild(option);

    loginShops.forEach((shop) => {
        let option = document.createElement('option');
        option.setAttribute('value', shop.id);
        option.textContent = shop.name;
        select.appendChild(option);
    });

    select.selectedIndex = (beforeSelectedIndex >= 0) ? beforeSelectedIndex : 0;
}

const getSelectedLoginShopId = () => {
    const select = getLoginShopsSelect();
    return (select.value !== '') ? select.value : null;
}

const saveLoginShop = async () => {
    const loginShop = createLoginShopFromForm();
    const selectedLoginShopId = getSelectedLoginShopId();

    if(selectedLoginShopId === null) {
        await LoginShopManager.insertLoginsShop(loginShop);
    } else {
        await LoginShopManager.updateLoginShop(selectedLoginShopId, loginShop);
    }

    alert('ログイン情報を保存しました。');
}

const deleteLoginShop = async () => {
    const selectedLoginShopId = getSelectedLoginShopId();
    await LoginShopManager.deleteLoginShop(selectedLoginShopId);
    alert('ログイン情報を削除しました。');
}

const showPassword = (input) => {
    input.type = 'text';
}

const hidePassword = (input) => {
    input.type = 'password';
}

const togglePasswordDisplay = (input, shown) => {
    if(shown) {
        showPassword(input);
    } else {
        hidePassword(input);
    }
}

const main = async () => {
    const loginShops = await LoginShopManager.getLoginShops();
    updateLoginShopsSelect(loginShops);

    const select = getLoginShopsSelect();
    select.addEventListener('change', () => {
        const selectedLoginShopId = select.value;
        onSelectLoginShop(selectedLoginShopId);
    })

    document.querySelectorAll('.show-password').forEach((element) => {
        element.addEventListener('change', function() {
            const passwordInputId = this.getAttribute('data-for-input');
            const passwordInput = document.getElementById(passwordInputId);
            togglePasswordDisplay(passwordInput, this.checked);
        })
    })

    document.getElementById('save-login-shop').addEventListener('click', async () => {
        await saveLoginShop();
        const loginShops = await LoginShopManager.getLoginShops();
        updateLoginShopsSelect(loginShops);

        // 追加した店舗を選択状態にする
        if(select.selectedIndex === 0) {
            const lastSelectedIndex = select.options.length - 1;
            select.selectedIndex = lastSelectedIndex;
        }
    });
    document.getElementById('delete-login-shop').addEventListener('click', async () => {
        const label = select.options[select.selectedIndex].textContent;
        if(confirm(`「${label}」のログイン情報を削除します。よろしいですか？`)) {
            await deleteLoginShop();
            const loginShops = await LoginShopManager.getLoginShops();
            updateLoginShopsSelect(loginShops);

            // 店舗の選択状態を新規追加の状態にする
            select.selectedIndex = 0;
            clearLoginShopForm();
        }
    });
}

const createLoginShopFromForm = () => {
    const shopName = document.getElementById('shop-name').value;
    const shopId   = md5(shopName);
    const rLoginId = document.getElementById('r-login-id').value;
    const rLoginPassword = document.getElementById('r-login-password').value;
    const rakutenId = document.getElementById('rakuten-login-id').value;
    const rakutenPassword = document.getElementById('rakuten-login-password').value;

    return {
        id: shopId,
        name: shopName,
        rLogin: {
            id: rLoginId,
            password: rLoginPassword
        },
        rakutenMember: {
            id: rakutenId,
            password: rakutenPassword
        }
    }
}

main();