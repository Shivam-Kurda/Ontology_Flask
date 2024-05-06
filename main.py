from flask import Flask,redirect,url_for,render_template,request
import json
import difflib


app=Flask(__name__)


def find_closest_match(word, word_set):
    
    closest_match = difflib.get_close_matches(word, list(word_set), n=1, cutoff=0.7)  
    return closest_match[0] if closest_match else None


file_path="static/names.json"
with open(file_path, "r") as json_file:
            names_dict = json.load(json_file)

classes=set(names_dict.keys())

@app.route("/",methods=["POST","GET"])
def home():


    if(request.method=="POST"):
        print("called")
        class_nm=request.form["class"]
        if(class_nm in classes):
            build_json(class_nm)

        else:
            closest_match=find_closest_match(class_nm,classes)

            build_json(closest_match)

        
        

        

        

        return render_template("ontology_tree.html")
    else:
        return render_template("index.html")


def build_json(cl_nm):
    file_path="static/graph_adj_list.json"
    with open(file_path, "r") as json_file:
        dict1 = json.load(json_file)
    visited=set()
    if(cl_nm not in dict1.keys()):
        dict_agg={"name":cl_nm}
    else:
        dict_agg={"name":cl_nm}
        dict_agg["children"]=[]
        for i in dict1[cl_nm]:
        
        
        
            if(i not in visited):
            
                dict_agg["children"].append(get_heirachjson(dict1,i,visited))
    file_path = "static/d3_modified.json"
    with open(file_path, "w") as json_file:
            
        json.dump(dict_agg, json_file, indent=4)
def get_heirachjson(dict1,root,visited):

    visited.add(root)
    if(root not in dict1.keys()):
        return {"name":root}
    
    dict_heirach={"name":root}
    dict_heirach["children"]=[]
    for i in dict1[root]:
        if(i not in visited):
            

            dict_heirach["children"].append(get_heirachjson(dict1,i,visited))

    return dict_heirach

@app.route("/second")
def second():
    return redirect(url_for("home"))
if(__name__=="__main__"):
    app.run(debug=True)
