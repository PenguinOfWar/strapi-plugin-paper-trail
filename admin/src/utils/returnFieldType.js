export default function returnFieldType(type) {
  const validTypes = [
    'datetime',
    'enumeration',
    'email',
    'integer',
    'biginteger',
    'decimal',
    'float',
    'media',
    'richtext',
    'relation',
    'dynamiczone',
    'json',
    'boolean',
    'component',
    'text',
    'string',
    'uid'
  ];

  return validTypes.includes(type) ? type : 'string';
}
