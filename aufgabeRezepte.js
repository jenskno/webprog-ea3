/**
 * Created by jens on 22.11.15.
 */
var databox, db;
function initiate(){
    databox = document.getElementById('databox');
    var button = document.getElementById('save');
    button.addEventListener('click',  checkInput);
    //button.addEventListener('click', addobject);

    var request = indexedDB.open('aufgabeRezepte01');
    request.addEventListener('error', showerror);
    request.addEventListener('success', start);
    request.addEventListener('upgradeneeded', createdb);
}
function showerror(e){
    alert('Error: ' + e.code + ' ' + e.message);
}
function start(e){
    db = e.target.result;
    show();
}
function createdb(e){
    var datababase = e.target.result;
    var mystore = datababase.createObjectStore('rezepte', {keyPath: 'rezeptname'});
    mystore.createIndex('SearchAutor', 'autorname', {unique: false});
}
function addobject(){

    var rezeptname  = document.getElementById('rezeptname').value;
    var autorname   = document.getElementById('autorname').value;
    var speiseart   = document.getElementById('sa').value;
    var speisetyp   = document.getElementById('st').value;
    var zutaten     = document.getElementById('zeigeAnzahl').value;

    //alert(rezeptname +  " " + autorname +  " " + speiseart +  " " + speisetyp +  " " + zutaten);

    var mytransaction = db.transaction(['rezepte'], "readwrite");
    var mystore = mytransaction.objectStore('rezepte');
    mytransaction.addEventListener('complete', show);

    var request = mystore.add({rezeptname: rezeptname, autorname: autorname, speiseart: speiseart, speisetyp: speisetyp, zutaten: zutaten});
    document.getElementById('rezeptname').value = '';
    document.getElementById('autorname').value= '';
    document.getElementById('sa').value= '';
    document.getElementById('st').value= '';
    document.getElementById('zeigeAnzahl').value= '';
    document.getElementById('zut').value= '';

}
function show(){
    databox.innerHTML = '';
    var mytransaction = db.transaction(['rezepte']);
    var mystore = mytransaction.objectStore('rezepte');
    var newcursor = mystore.openCursor();
    newcursor.addEventListener('success', showlist);
}
function showlist(e){
    var cursor = e.target.result;
    if(cursor){
        databox.innerHTML +=    '<div>' + cursor.value.rezeptname +
                                ' - '   + cursor.value.autorname  +
                                ' - '   + cursor.value.speiseart  +
                                ' - '   + cursor.value.speisetyp  +
                                ' - '   + cursor.value.zutaten  +'</div>';
        cursor.continue();
    }
}

function checkInput(){
        var fehler = "";
        var speiseart = false;
        var speisetyp = false;

        // prüfe auf Vorgaben Rezeptname
        if(document.getElementById('rezeptname').value != ""){
            if (document.getElementById('rezeptname').value.length > 4){
            }else{
                fehler += "\nRezeptname zu kurz";
            }
        }else{
            fehler += "\nRezeptname darf nicht leer sein!";
        }
        // prüfe auf Vorgaben Autor
        if( document.getElementById('autorname').value != ""){
        }else{
            fehler += "\nAngabe Autor darf nicht leer sein!";
        }
        // prüfe auf Vorgaben Speiseart/Speisetyp
        if(document.getElementById('sa').value == "Vorspeise" ||
            document.getElementById('sa').value == "Hauptspeise" ||
            document.getElementById('sa').value == "Dessert"){
            speiseart = true;
        }else{
            fehler += "\nUnbekannte Speiseart!";
        }


        if(document.getElementById('st').value == "suess" ||
            document.getElementById('st').value == "suesssauer" ||
            document.getElementById('st').value == "herzhaft" ||
            document.getElementById('st').value == "geschmacklos"){
            speisetyp = true;
        }else{
            //alert(document.getElementById('st').value);
            fehler += "\nUnbekannter Speisetyp!";
        }


        if(speisetyp == false || speiseart == false){
            fehler += "\nBitte mindestens ein Speiseart bzw. Speisetyp angeben!";
        }
        // prüfe auf Angaben Zutaten
        if(document.getElementById('zeigeAnzahl').value < 1){
            fehler += "\nDas Rezept sollte mindestens eine Zutat enthalten!";
        }

        if (fehler == ""){
            addobject();
        } else {
            alert("Folgende(r) Fehler trat(en) auf!\n" + fehler);
            return false;
        }
    }

addEventListener('load', initiate);