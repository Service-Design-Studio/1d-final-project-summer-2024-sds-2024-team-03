require "rails_helper"

RSpec.describe ActionablesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/actionables").to route_to("actionables#index")
    end

    it "routes to #new" do
      expect(get: "/actionables/new").to route_to("actionables#new")
    end

    it "routes to #show" do
      expect(get: "/actionables/1").to route_to("actionables#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "/actionables/1/edit").to route_to("actionables#edit", id: "1")
    end


    it "routes to #create" do
      expect(post: "/actionables").to route_to("actionables#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/actionables/1").to route_to("actionables#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/actionables/1").to route_to("actionables#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/actionables/1").to route_to("actionables#destroy", id: "1")
    end
  end
end
