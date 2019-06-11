const judgePurview = () => {
    if (JSON.parse(sessionStorage.getItem("jcmx-userinfo")).purview == 1) {
        return false;
    }
    return true;
}

export {
    judgePurview
}