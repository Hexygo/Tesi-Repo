function intersection(array1, array2) {
  array1.filter(function(x) {
    return array2.indexOf(x) != -1;
  });
}
