const mapSection = (data, targetId) => {
    const result = {}

    for (let item of data) {
        if (result.sectionId) {
            break;
        } else if (item.id == targetId) {
            result.section = {
                id: item.id,
                name: item.name
            };
            result.title = item.seoTitle;
            result.keywords = item.seoKeyword;
            result.description = item.seoDescription;
            break;
        } else if (item.hasOwnProperty('children')) {
            for (let subItem of item.children) {
                if (subItem.id == targetId) {
                    result.section = {
                        id: item.id,
                        name: item.name
                    };
                    result.childSection = {
                        id: subItem.id,
                        name: subItem.name
                    };
                    result.title = subItem.seoTitle;
                    result.keywords = subItem.seoKeyword;
                    result.description = subItem.seoDescription;
                    break;
                }
            }
        }
    }

    return result;
}

module.exports = mapSection;