# TP1-Mouloudi

TP1 du module TIW8

L’objectif du TP est de mettre en place une Single Page Application (SPA),
développée principalement côté client avec React, avec un serveur Node/Express 
lége
3 composants ont été créés : 

Header = TP1-TIW8- MOULOUDI Mohamed Amine
Content = photo de la ville de Lyon + description 
ButtonMaterialize = button utilise les différents "class" css du framework materialize

La  instruction pour intégrer  le framework Materialize.css :
1- npm install materialize-css@next
2- Ajouter  dans le webpack les règles suivantes
module: {
   rules: [
    // CSS loader here
    {
       test: /\.svg$/,
       use: 'file-loader'
     }
   ]
}

3-installer les dépendance suivante  css-loader et style-loader
 npm install --save-dev style-loader css-loader


