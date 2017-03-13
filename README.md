![datavis](http://bonjourmonde.net/images/datavis-git.png)  

This is an experimental tool for experimental typography.     

This tool was created for a workshop as an introduction to font variable manipulation. We used a font drawn by [Lucas Descroix](http://lucasdescroix.fr/) and  [ttx](https://github.com/fonttools/fonttools) a software written by Just van Rossum that allows one to extract the table that composes a _ttf_ or _otf_ file.   

We are principally using the table named ```FontName.g_l_y_f.ttx```, this table is an xml file that provides all the positions of the points, contour by contour, letter by letter. We transform it into a json object with xml2js in order to realise a data-visualisation of the font with d3.js and manipulate the data.   

```
.
├── font-archive                        # to store your generated font
├── index.html   
├── js
│   ├── d3-dispatch.js                  # d3 library
│   ├── d3-drag.js                      #
│   ├── d3.min.js                       #
│   ├── d3-scale.js                     #
│   ├── d3-selection.js                 #
│   ├── functions.js                    # contains xml2json and ajax to upload the file
│   ├── jquery224.min.js
│   ├── script.js                       # the script to manipulate the data with d3 
│   └── x2js 
│       ├── bower.json
│       ├── check_issues.html
│       ├── demo.html
│       ├── package.json
│       ├── README.md
│       ├── samples.html
│       ├── xml2json.js
│       └── xml2json.min.js
├── readme.md
├── style.css                           # the general style for the index
├── ttx                                 # the font folder to dump all the tables
│   ├── MyFont._c_m_a_p.ttx
│   ├── MyFOnt._c_v_t.ttx
│   ├── MyFOnt.D_S_I_G_.ttx
│   ├── MyFOnt._f_p_g_m.ttx
│   ├── MyFOnt._g_a_s_p.ttx
│   ├── MyFOnt.G_D_E_F_.ttx
│   ├── MyFOnt._g_l_y_f.ttx
│   ├── MyFOnt.GlyphOrder.ttx
│   ├── MyFOnt.G_P_O_S_.ttx
│   ├── MyFOnt.G_S_U_B_.ttx
│   ├── MyFOnt._h_e_a_d.ttx
│   ├── MyFOnt._h_h_e_a.ttx
│   ├── MyFOnt._h_m_t_x.ttx
│   ├── MyFOnt._l_o_c_a.ttx
│   ├── MyFOnt._m_a_x_p.ttx
│   ├── MyFOnt._n_a_m_e.ttx
│   ├── MyFOnt.O_S_2f_2.ttx
│   ├── MyFOnt._p_o_s_t.ttx
│   ├── MyFOnt._p_r_e_p.ttx
│   ├── MyFOnt.ttx
│   └── MyFOnt.ttf
└── xml-rw.php                          # php script to save the new data into MyFOnt._g_l_y_f.ttx

```


**First you need to install _fonttool (ttx)_ :**
  
<https://github.com/fonttools/fonttools>   


####1.extract and recompile a font  

For this workshop we used only _ttf_ or _woff_ files.   

in the terminal go to the ttx folder and use      
```bash
ttx -s Myfont.ttf 
```

recompile the font :     
```bash
ttx Myfont.ttx
```


You can use the datavisualisation system in any browser, you just need to start a php server.  

####2. start a php server in the /tool folder

```bash
php -S localhost:7000
```

the path to the ttx table must be indicated in the _xml-rw.php_ file on line 3,
don't forget to change it to the right name.    


####3. then go to your browser @ localhost:7000 to manipulate the data


---

For those who need a tutorial for the command line, here are some useful links ;

<https://gitlab.com/tseqi/git-tuto>   
<http://relearn.be/2013/r/cheat-sheet::git-and-the-command-line.html>    
<http://i.liketightpants.net/and/absolute-beginners-unix-for-art-students-part-2>    
 

---

by : [Bonjour Monde](bonjourmonde.net)   
with : Aurélie Cousquer, Celia Grandhomme, Gaspard Ollagnon, Jessica-Maria Nassif, Roger Gaillard, Tanja Reiterer.
