from flask import Flask,redirect,url_for,render_template,request
import json
app=Flask(__name__)



@app.route("/",methods=["POST","GET"])
def home():

    if(request.method=="POST"):

        class_nm=request.form["class"]
        build_json(class_nm)

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
