import _ from 'lodash';

//kebabCase _.kebabCase('Foo Bar');=>   'foo-bar'  _.kebabCase('fooBar'); =>   'foo-bar'
const slugify=text=>_.kebabCase(text);

async function createUniqueSlug(Model, slug, count){
    const user =await Model.findOne({slug: `${slug}-${count}`}, 'id');

    if(!user){
        return `${slug}-${count}`;
    }

    return createUniqueSlug(Model, slug, count+1);
}

async function generateSlug(Model , name, filter={}){
    console.log('GenerateSlug Welcome ');
    const origSlug=slugify(name);
    console.log('Slugify  ' ,origSlug );
    const user =await Model.findOne(Object.assign({slug: origSlug}, filter), 'id');

    if(!user){
        return origSlug;
    }
    return createUniqueSlug(Model, origSlug, 1);
}

export default generateSlug;