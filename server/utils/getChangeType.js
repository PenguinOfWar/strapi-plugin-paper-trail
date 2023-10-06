module.exports = (method) => {
    const changeTypes={
        'POST':'CREATE',
        'PUT':'UPDATE',
        'DELETE':"DELETE"
    }
    return changeTypes[method]
  };
  