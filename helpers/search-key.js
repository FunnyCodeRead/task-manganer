module.exports = (query) => {
  let ObjectKey = {
    keyword: "",
    regex: "",
  };

  if (query.keyword) {
    ObjectKey.keyword = query.keyword;
    ObjectKey.regex = new RegExp(ObjectKey.keyword, "i");
  }

  return ObjectKey;
};
