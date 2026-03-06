# Par où commencer ?

**Par où commencer ?** C'est la question qu'on peut se poser en commençant le développement web.
La plupart des enseignants/référents de formation dans le développement web conseil souvent le Javascript pour commencer avec les différentes technologies comme Node.js, React.js, et tant d'autre.
Seulement, il y a un moment où l'on doit passer forcément par le PHP et ses frameworks. Alors une question naturelle peut se poser :

## JavaScript ou PHP ?

Pour commencer, grâce à [perplexity](https://www.perplexity.ai/), j'ai pu créer un aperçu des différentes technologies :

| Critère                  | JavaScript                                                                 | PHP                                           |
|---------------------------|----------------------------------------------------------------------------|-----------------------------------------------|
| Type de langage           | Client-side (initialement), Full-stack avec Node.js                        | Server-side uniquement                       |
| Performance               | Rapide grâce à son modèle non-bloquant et asynchrone (Node.js)             | Plus lent, modèle bloquant et synchrone       |
| Utilisation principale    | Front-end et Back-end (avec Node.js)                                       | Back-end, gestion des bases de données        |
| Courbe d'apprentissage    | Plus complexe, surtout avec les frameworks modernes (React, Angular)       | Plus simple à apprendre et configurer         |
| Interactivité en temps réel| Excellente (ex. : applications de chat, streaming)                         | Limitée                                       |
| Sécurité                  | Moins sécurisé (code visible dans le navigateur)                          | Plus sécurisé (code caché côté serveur)       |
| Communauté                | Très vaste et active, populaire sur GitHub                                | Large communauté mais moins dynamique         |
| Écosystème                | Frameworks riches : React, Vue.js, Angular, Node.js                       | Frameworks robustes : Laravel, Symfony        |

### Que doit-on en retenir ?

* JavaScript permet de créer une app complète tandis que php doit être couplé à d'autres langages.
* JavaScript nous propose un système fluide qui peut travailler tout en attendant des réponses API tandis que PHP n'attend pas la réponse avant d'afficher quoi que ce soit ce qui provoque des rechargement de la page fréquent.
* Le PHP se limite au Back, la partie front est gérer par un code HTML couplé à d'autres langages en plus de PHP tanis que JavaScript est FullStack
* PHP reste plus simple d'apprentissage que JavaScript (avis général). De mon point de vue, je trouve JavaScript beaucoup plus simple et compréhensible surtout quand on s'attaque aux différents frameworks des deux technologies.
* Au niveau de la sécurité, PHP reste un très bon point car le code est coté serveur donc inaccessible à l'utilisateur tandis que JavaScript à une partie Client-side donc accessible à l'utilisateur.
* Pour ce qui est des deux communautés, JavaScript à la chance d'être le langage du moment donc il possède une communauté très présente et active tandis que PHP à pour slogan de mourir par beaucoup de développeur et donc sa communauté est moins dynamique mais toujours aussi grande.

### Quand choisir JS ou PHP ?

JavaScript est une technologie intéressante lorsqu'on a besoin d'intéraction et de temps réel.
Tandis que PHP est à choisir quand la grande partie de notre app se base sur le Backend ou sur la communication avec une BDD*.

*(\*BDD : Base de donnée)*

## Conclusion

Malgré leurs différences, PHP et JavaScript peuvent avoir des points communs mais aussi leurs différents points forts comparé à l'autre. La où PHP serait un langage pour "débutant", JavaScript le compense en étant une tech complète et fullstack. JavaScript pourra faire de l'intéraction et du temps réel, PHP lui nous assure une sécurité accru comparé au JS grâce à son server-side !

# Et à l'avenir ?

C'est vrai ça, si je commence par apprendre le php car il se veut adapté aux débutants mais qu'il vient à "mourir" comme le disent beaucoup de monde, ça me fera prendre du retard comparé aux autres... Mais si je pars de ce principe et que j'étudie le JS mais que PHP lave cette réputation et devient LE langage web...

D'après certaines études de 2025, JavaScript et PHP avancent tout les deux et s'adaptent aux temps modernes. Voyons voir comment :

## PHP : Modernisation de ce langage âgé

Grâce à la sortie de PHP8 et l'intégration du compiler JIT (Just-In-Time) ainsi que d'autres fonctionnalités, PHP devient plus performant avec une rapidité d'exécution accrue et l'optimisation de la gestion mémoire. Les frameworks PHP se renforcent également, Symfony, Laravel ou encore Codelgniter sont de premier choix pour les développeur qui souhaite coder des app complexes grâce à leur scalabilité*. Mais, il faut savoir, pour les projets minimalistes et légés, des **micro-frameworks** émergent tel que Flight PHP.
Les nouvelles versions de PHP adopte l'architecture serverless. Certains, peu habitué à tout ces termes et cette technologie, me diront *"Mais PHP est une technologie server-side, comment elle peut fonctionner sans serveur ?"* Eh bien ce n'est pas exactement ça, une architecture serverless **ne veut pas dire "sans server"**, on va dire que les services cloud permettent de ne faire appel aux serveurs que lorsqu'une fonction les solicitent. Cette technologie permet de faire des économie aux développeurs et entreprise, au lieu de payer un serveur qui va tourner à longueur de journée, on ne paie que lorsqu'il sera appelé par l'utilisateur. En gros l'utilisateur fait appel à une fonction via une intéraction quelconque, le serveur s'allume, exécute la fonction et s'éteint.
Et un dernier point sur le PHP, depuis quelques années on peut voir les cyberattaques se démultiplier, ce qui pose problème à beaucoup de monde. Donc dernièrement, PHP à mis les bouchées doubles sur la cybersécurité, ce langage qui était déjà connu pour être plus sécurisé que le JavaScript le devient encore plus !

*(\*Scalabilité : Capacité à s'adapté à des projets de plus en plus gros et complexe grâce à des codes organisés et optimisés)*

### Résumons !
> * PHP devient de plus en plus rapide et optimisé
> * Il se veut solide face aux projets monstre mais également disponible pour des projets léger et peu complexes
> * l'architecture serverless permet de faire des économies aux devs et entreprise
> * La cybersécurité est un point clé du langage

## JavaScript : La porte ouverte à l'innovation

Le petit nouveau, face à PHP, se démarque comparé à celui-ci via le côté frontend mais également en back grâce à Node.js. Et cela peut paraître bizarre mais JavaScript est sans doute voué à être délaissé face à son petit frère : **TypeScript** ! Ce nouveau langage est basé sur JavaScript mais rajoute un typage statique qui permet la création d'app plus rapidement et avec les conflits en moins ce qui rend le JavaScript presque useless* car on garde dans TypeScript une base de JavaScript avec un typage obligatoire.
D'un autre côté, nous avons les frameworks JS (valable aussi avec TS) qui se développe pour empiéter sur le domaine incontesté jusqu'à présent de PHP en voulant se mettre au rendu server-side tout en répondant aux défis modernes ainsi qu'à la gestion d'état. La gestion d'état, un invention qui change bien des aspect comparé à d'autres frameworks. On peut donc se demander si les frameworks JS ne deviendront pas les **frameworks ultimes**. En venant à parler des frameworks, j'étais obligé de vous parler de ce frameworks qui se développe... Vous vous souvenez des micro-frameworks PHP ? Eh bien JavaScript n'a pas à se cacher sur ce point là grâce à Svelte qui se veut pour les projets léger mais optimiser et rapide mais également simple d'apprentissage.
Mais ce n'est pas tout, JavaScript vient encore empiéter sur le domaine de PHP en rentrant dans l'**internet des objets** mais il se développe aussi avec l'**intelligence artificielle** ce qui permet de donner des app connectées et intelligente.

*(\*useless = inutile)*

### Résumons !
> * JavaScript est utilisé pour son côté fullstack (frontend et backend)
> * JavaScript sera sans doute moins utilisé dans le futur mais remplacé par le TypeScript (JavaScript typé)
> * Les frameworks JS cherche à prendre du terrain sur le server-side et combine la gestion d'état
> * Svelte est la concurrence des micro-frameworks de PHP
> * JavaScript débarque dans l'internet des objets et dans l'IA

## Conclusion

PHP cherche toujours à devenir une technologie de pointe sur les points qu'il maitrise comme la cybersécurité et la performance et il cherche aussi à s'adapté aux architecture moderne. PHP reste un très bon langage côté serveur et il n'a rien à envier à JS.
JavaScript, quant à lui, domine grâce à son rôle polyvalent dans le front-end et le back-end, ainsi qu'à son adoption croissante dans des domaines innovants comme l'IoT.
Mais la vrai question est **pourquoi choisir l'un ou l'autre quand on sait que les deux se marient très bien ensemble ?**

# Pour toi qui débute :
Pour un développeur web souhaitant **maximiser ses opportunités futures** :
* Étudier JavaScript est essentiel pour maîtriser les technologies interactives modernes.
* PHP reste un choix stratégique pour le développement robuste côté serveur et les solutions économiques. Les deux technologies se complètent parfaitement selon les besoins du projet.
Pas le choix : **Il faut étudier les deux** ça ne peut être que bénéfique