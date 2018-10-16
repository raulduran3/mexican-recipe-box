var Panel = ReactBootstrap.Panel, Accordion = ReactBootstrap.Accordion;
      var Button = ReactBootstrap.Button, Input = ReactBootstrap.Input;
      var ButtonToolbar = ReactBootstrap.ButtonToolbar;
      var Modal = ReactBootstrap.Modal;
      var OverlayTrigger = ReactBootstrap.OverlayTrigger;
      var ListGroup = ReactBootstrap.ListGroup,ListGroupItem = ReactBootstrap.ListGroupItem;

      var recipes = (typeof localStorage["MexicanRecipeBook"] != "undefined") ? JSON.parse(localStorage["MexicanRecipeBook"]) : [
        {title: "Guacamole", ingredients: ["Avocado", "Salt", "Lime", "Cilantro", "Onion"]},
        {title: "Enchiladas", ingredients: ["Chicken", "Green Chiles", "Garlic Powder", "Butter"]},
        {title: "Tres Leches", ingredients: ["Flour", "Baking Powder", "Sugar", "Butter"]},
        {title: "Chimichangas", ingredients: ["Beef", "Onion", "Green Bell Pepper", "Taco Sauce", "Chili Powder"]},
        {title: "Quesadillas", ingredients: ["Chicken", "Vegetable Oil", "Green Bell Peppers"]}
      ], globalTitle = "", globalIngredients = [];

      var RecipeBook = React.createClass({
        render: function() {
          return (
            <div>
              <Accordion>
                {this.props.data}
            </Accordion>
            </div>
          );
        }
      });

      var Recipe = React.createClass({
        remove: function() {
          recipes.splice(this.props.index, 1);
          updateList();
        },
        edit: function() {
          globalTitle = this.props.title;
          globalIngredients = this.props.ingredients;
          document.getElementById("show").click();
        },
        render: function() {
          return (
            <div>
              <h4 className="text-center">Ingredients</h4><hr/>
              <IngredientList ingredients={this.props.ingredients} />
              <ButtonToolbar>
                <Button class="delete" bsStyle="danger" id={"btn-del"+this.props.index} onClick={this.remove}>Delete</Button>
                <Button bsStyle="default" id={"btn-edit"+this.props.index} onClick={this.edit}>Edit</Button>
            </ButtonToolbar>
            </div>
          );
        }
      });

      var IngredientList = React.createClass({
        render: function() {
          var ingredientList = this.props.ingredients.map(function(ingredient) {
            return (
              <ListGroupItem>
                {ingredient}
            </ListGroupItem>
            );
          });
          return (
            <ListGroup>
            {ingredientList}
            </ListGroup>
          );
        },
      });

      var RecipeAdd = React.createClass({
        getInitialState: function() {
          return { showModal: false };
        },
        close: function() {
          globalTitle = "";
          globalIngredients = [];
          this.setState({ showModal: false });
        },
        open: function() {
          this.setState({ showModal: true });
          if (document.getElementById("title") && document.getElementById("ingredients")) {
            $("input#title").val(globalTitle);
            $("#ingredients").val(globalIngredients);
            if (globalTitle != "") {
              $("#modalTitle").text("Edit Recipe");
              $("#addButton").text("Edit Recipe");
            }
          }
          else requestAnimationFrame(this.open);
        },
        add: function() {
          var title = $("input#title").val();
          var ingredients = $("textarea#ingredients").val().split(",");
          var exists = false;
          for (var i = 0; i < recipes.length; i++) {
            if (recipes[i].title === title) {
              recipes[i].ingredients = ingredients;
              exists = true;
              break;
            }
          }
          if (!exists) {
            if (title.length < 1) title = "Untitled";
            recipes.push({title: title, ingredients: $("textarea#ingredients").val().split(",")});
          }
          updateList();
          this.close();
        },
        render: function() {
          return (
            <div>
              <Button
                bsStyle="info"
                bsSize="large"
                onClick={this.open}
                id="show"
                className="btn-raised"
              >
                Add Recipe
            </Button>
              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title id="modalTitle">Add a Recipe</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                  <form>
                    <Input type="text" label="Recipe" placeholder="Recipe Name" id="title" />
                    <Input type="textarea" label="Ingredients" placeholder="Enter Ingredients,Separated,By Commas" id="ingredients"/>
            </form>
            </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.add} bsStyle="info" id="addButton">Add Recipe</Button>
                  <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
            </Modal>
            </div>
          );
        }
      });

      function updateList() {
        localStorage.setItem("MexicanRecipeBook", JSON.stringify(recipes));
        var rows = [];
        for (var i=0; i < recipes.length; i++) {
          rows.push(
            <Panel header={recipes[i].title} eventKey={i} bsStyle="info">
              <Recipe title={recipes[i].title} ingredients={recipes[i].ingredients} index={i}/>
            </Panel>
          );
        }

        ReactDOM.render(<RecipeBook data={rows}/>, document.getElementById("container"));
      }

      ReactDOM.render(<RecipeAdd/>, document.getElementById("button"));
      updateList();
